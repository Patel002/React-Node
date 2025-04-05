import { sequelize } from "./sequelize.js";
import { app } from "./app.js";
import dotenv from 'dotenv';
import { apply } from "./model/association.model.js";
import { expiredPermissionDeletion } from "./utils/cron.js";
dotenv.config();

const PORT = process.env.PORT || 3000;

apply();
expiredPermissionDeletion();

sequelize.authenticate()
    .then(() => console.log('Connected to MySQL Database!'))
    .catch(err => console.error('Unable to connect:', err));

    // sequelize.sync({ force: false })

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export { app };