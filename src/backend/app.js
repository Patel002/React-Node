import express from 'express';
import cors from 'cors';
import path from 'path';
import userDataRouter from './routes/user.routes.js';
import superAdminRouter from './routes/superAdmin.routes.js';
import roleRouter from './routes/role.routes.js';
import menuRouter from './routes/menu.routes.js';  
import submenuRouter from './routes/subMenu.routes.js'; 
import permissionRouter from './routes/permission.routes.js';
import settingsRouter from './routes/settings.routes.js';
import infoRouter from './routes/info.routes.js';
import glRouter from './routes/GlCode.routes.js';
import accountingRouter from './routes/accounting.routes.js';
import termsRouter from './routes/terms.routes.js';

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
app.use('/temp',express.static(path.join(process.cwd(),'public/temp')));

app.use("/api/user-data", userDataRouter);
app.use("/api/superadmin", superAdminRouter);
app.use("/api/role", roleRouter);
app.use("/api/menu", menuRouter);
app.use("/api/submenu", submenuRouter);
app.use("/api/permission", permissionRouter);
app.use("/api/info", infoRouter);
app.use("/api/settings",settingsRouter);
app.use("/api/glcode",glRouter);
app.use("/api/accounting",accountingRouter);
app.use("/api/terms",termsRouter);

export { app };