import express from 'express';
import cors from 'cors';
import userDataRouter from './routes/user.routes.js';
import superAdminRouter from './routes/superAdmin.routes.js';
import roleRouter from './routes/role.routes.js';
import menuRouter from './routes/menu.routes.js';  
import submenuRouter from './routes/subMenu.routes.js'; 
import permissionRouter from './routes/permission.routes.js';   

const app = express();

app.use(cors(
    {
        origin: '*',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }
));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user-data", userDataRouter);
app.use("/api/superadmin", superAdminRouter);
app.use("/api/role", roleRouter);
app.use("/api/menu", menuRouter);
app.use("/api/submenu", submenuRouter);
app.use("/api/permission", permissionRouter);

export { app };