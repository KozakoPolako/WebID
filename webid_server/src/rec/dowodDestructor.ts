import { spawn } from "child_process";
import { Console } from "console";

export  async function destructDowod(filepath: string, side: string): Promise<void> {
  return new Promise ((resolve, reject) => {
    const python = spawn("python", [
      "documentDestructor/start.py",
      filepath,
      side,
    ]);
    python.stdout.on("data", (data) => {
      console.log("python: ", data.toString());
    });
    python.stderr.on("data", (err) => {
      console.log("python error:", err.toString());
    });
    python.on('close', (code) => {
      if (code === 0){
        console.log("python DONE")
        resolve();
      } else {
        reject(new Error("nie udało się odczytać dokumentu"))
      }
    })
  })
}

  
