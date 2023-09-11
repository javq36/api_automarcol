import sql from "mssql";

const dbSettings = {
  user: "Sistemas",
  password: "Automarcol+2023A*",
  server: "190.85.51.38",
  /* server: "192.168.1.91", provisional */
  port: 1433,
  connectionTimeout: 30000,
  instance: "MSSQLSERVER",
  database: "AUTOMARCOL",
  pool: {
    max: 20,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

export const getConection = async () => {
  try {

    try {
      const pool = await sql.connect(dbSettings);
      return pool;
      
    } catch (error) {
      console.log(error);
    }

  } catch (error) {

    console.log(error);
    return null;
  }
};

