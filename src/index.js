import app from "./app";
import "./databases/conection";

app.listen(app.get("port"));

console.log(`Server is running on port ${app.get("port")}`);