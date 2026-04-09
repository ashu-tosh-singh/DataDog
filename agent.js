const si = require("systeminformation");
const Docker = require("dockerode");
const { createClient } = require("@supabase/supabase-js");

require("dotenv").config();

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
  {
    auth: {
      persistSession: false
    }
  }
);

const docker = new Docker();

// Collect system metrics
async function collectMetrics() {
  try {
    const cpu = await si.currentLoad();
    const mem = await si.mem();
    const disk = await si.fsSize();

    return {
      cpu: cpu.currentLoad,
      memory: (mem.used / mem.total) * 100,
      disk: disk[0]?.use || 0
    };
  } catch (err) {
    console.error("❌ Error collecting metrics:", err.message);
    return null;
  }
}

// Get running containers
async function getContainers() {
  try {
    const containers = await docker.listContainers();

    return containers.map(c => ({
      name: c.Names[0],
      status: c.State
    }));
  } catch (err) {
    console.error("❌ Error fetching containers:", err.message);
    return [];
  }
}

// Send data to Supabase
async function sendData() {
  try {
    console.log("⏳ Collecting data...");

    const metrics = await collectMetrics();
    if (!metrics) return;

    const containers = await getContainers();

    // ---------------- METRICS ----------------
    const { data: mData, error: mError } = await supabase
      .from("metrics")
      .insert({
        server_id: process.env.SERVER_ID,
        cpu_usage: metrics.cpu,
        memory_usage: metrics.memory,
        disk_usage: metrics.disk
      });

    if (mError) {
      console.error("❌ Metrics insert error:", mError.message);
    } else {
      console.log("✅ Metrics inserted");
    }

    // ---------------- CONTAINERS ----------------
    for (let c of containers) {
      const { error: cError } = await supabase
        .from("containers")
        .insert({
          server_id: process.env.SERVER_ID,
          container_name: c.name,
          status: c.status
        });

      if (cError) {
        console.error(
          `❌ Container insert error (${c.name}):`,
          cError.message
        );
      }
    }

    console.log(`📦 Processed ${containers.length} containers`);

    // ---------------- ALERT ----------------
    if (metrics.cpu > 80) {
      const { error: aError } = await supabase
        .from("alerts")
        .insert({
          server_id: process.env.SERVER_ID,
          type: "CPU",
          message: "High CPU usage"
        });

      if (aError) {
        console.error("❌ Alert insert error:", aError.message);
      } else {
        console.log("🚨 Alert triggered: High CPU");
      }
    }

    console.log("✅ Data cycle complete at", new Date().toISOString());

  } catch (err) {
    console.error("❌ Fatal error in sendData:", err.message);
  }
}

// Run every 10 seconds
setInterval(sendData, 10000);

// Run immediately on start
sendData();