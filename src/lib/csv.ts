import { Job, PaintSpec } from "./models";

/**
 * Exports jobs to a CSV string and triggers a download.
 */
export const exportJobsToCSV = (jobs: Job[]) => {
  const headers = ["Job Name", "Client Name", "Client Email", "Due Date", "Status", "Area", "What", "Manufacturer", "Range", "Colour Name", "Finish", "Notes"];
  
  const rows = jobs.flatMap(job => {
    // If no paint specs, still show the job info
    if (job.paintSpecs.length === 0) {
      return [[
        job.name,
        job.clientName,
        job.clientEmail || "",
        job.dueDate ? new Date(job.dueDate).toISOString().split('T')[0] : "",
        job.status,
        "",
        "",
        "",
        "",
        "",
        "",
        ""
      ]];
    }
    
    return job.paintSpecs.map(spec => [
      job.name,
      job.clientName,
      job.clientEmail || "",
      job.dueDate ? new Date(job.dueDate).toISOString().split('T')[0] : "",
      job.status,
      spec.area || "",
      spec.what || "",
      spec.manufacturer,
      spec.range || "",
      spec.colourName,
      spec.finish,
      spec.notes || ""
    ]);
  });

  const csvContent = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `itsmypaint_export_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Basic CSV parser to convert CSV string to Job objects.
 */
export const parseCSVToJobs = (csvText: string): Partial<Job>[] => {
  const lines = csvText.split(/\r?\n/);
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map(h => h.replace(/"/g, "").trim());
  const jobsMap: Record<string, Partial<Job>> = {};

  // Helper to find column index regardless of exact casing or small typos
  const getCol = (name: string) => {
    const n = name.toLowerCase();
    return headers.findIndex(h => {
      const hh = h.toLowerCase();
      return hh === n || hh.includes(n) || n.includes(hh);
    });
  };

  const idx = {
    jobName: getCol("Job Name"),
    clientName: getCol("Client Name"),
    clientEmail: getCol("Client Email"),
    dueDate: getCol("Due Date"),
    status: getCol("Status"),
    area: getCol("Area"),
    what: getCol("What"),
    manufacturer: getCol("Manufact"),
    range: getCol("Range"),
    colourName: getCol("Colour Name"),
    finish: getCol("Finish"),
    notes: getCol("Notes")
  };

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    const values = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.replace(/"/g, "").trim());
    
    const jobName = values[idx.jobName];
    const dueDate = values[idx.dueDate] || "NoDate";
    if (!jobName) continue;

    // Unique key is Name + Date to keep different dates separate
    const groupKey = `${jobName}_${dueDate}`;

    if (!jobsMap[groupKey]) {
      jobsMap[groupKey] = {
        name: jobName,
        clientName: values[idx.clientName] || "Unknown",
        clientEmail: values[idx.clientEmail] || "",
        dueDate: values[idx.dueDate] || "",
        status: (values[idx.status]?.toLowerCase() === "completed" ? "completed" : "active") as any,
        paintSpecs: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }

    if (values[idx.manufacturer] && values[idx.colourName]) {
      jobsMap[groupKey].paintSpecs?.push({
        area: values[idx.area] || "General",
        what: values[idx.what] || "Surface",
        manufacturer: values[idx.manufacturer],
        range: values[idx.range] || "",
        colourName: values[idx.colourName],
        finish: values[idx.finish] || "Matt",
        notes: values[idx.notes] || ""
      });
    }
  }

  return Object.values(jobsMap);
};
