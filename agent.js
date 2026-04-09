const si = require("systeminformation");
const Docker = require("dockerode");
const { createClient } = require("@supabase/supabase-js");

require("dotenv").config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const docker = new Docker();

async function collectMetrics() {
  const cpu = await si.currentLoad();
  const mem = await si.mem();
  const disk = await si.fsSize();

  return {
    cpu: cpu.currentLoad,
    memory: (mem.used / mem.total) * 100,
    disk: disk[0].use
  };
}

async function getContainers() {
  const containers = await docker.listContainers();

  return containers.map(c => ({
    name: c.Names[0],
    status: c.State
  }));
}

async function sendData() {
  try {
    const metrics = await collectMetrics();
    const containers = await getContainers();

    // Insert metrics
    await supabase.from("metrics").insert({
      server_id: process.env.SERVER_ID,
      cpu_usage: metrics.cpu,
      memory_usage: metrics.memory,
      disk_usage: metrics.disk
    });

    // Insert container data
    for (let c of containers) {
      await supabase.from("containers").insert({
        server_id: process.env.SERVER_ID,
        container_name: c.name,
        status: c.status
      });
    }

    // Alert logic
    if (metrics.cpu > 80) {
      await supabase.from("alerts").insert({
        server_id: process.env.SERVER_ID,
        type: "CPU",
        message: "High CPU usage"
      });
    }

    console.log("✅ Data sent at", new Date().toISOString());
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

// safer interval
setInterval(sendData, 30000);