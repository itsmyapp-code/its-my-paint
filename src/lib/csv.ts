import { Job, PaintSpec } from "./models";

/**
 * Exports jobs to a CSV string and triggers a download.
 */
export const exportJobsToCSV = (jobs: Job[]) => {
  const headers = ["Job Name", "Client Name", "Client Email", "Due Date", "Status", "Manufacturer", "Range", "Colour Name", "Finish"];
  
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
        ""
      ]];
    }
    
    return job.paintSpecs.map(spec => [
      job.name,
      job.clientName,
      job.clientEmail || "",
      job.dueDate ? new Date(job.dueDate).toISOString().split('T')[0] : "",
      job.status,
      spec.manufacturer,
      spec.range || "",
      spec.colourName,
      spec.finish
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

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    // Simple split (doesn't handle commas inside quotes perfectly, but sufficient for this template)
    const values = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.replace(/"/g, "").trim());
    
    const row: any = {};
    headers.forEach((h, idx) => { row[h] = values[idx]; });

    const jobName = row["Job Name"];
    if (!jobName) continue;

    if (!jobsMap[jobName]) {
      jobsMap[jobName] = {
        name: jobName,
        clientName: row["Client Name"] || "Unknown",
        clientEmail: row["Client Email"] || "",
        dueDate: row["Due Date"] || "",
        status: (row["Status"]?.toLowerCase() === "completed" ? "completed" : "active") as any,
        paintSpecs: []
      };
    }

    if (row["Manufacturer"] && row["Colour Name"]) {
      const spec: PaintSpec = {
        manufacturer: row["Manufacturer"],
        range: row["Range"] || "",
        colourName: row["Colour Name"],
        finish: row["Finish"] || "Matt"
      };
      jobsMap[jobName].paintSpecs?.push(spec);
    }
  }

  return Object.values(jobsMap);
};
