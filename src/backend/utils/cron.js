import cron from 'node-cron';
import { Permission } from '../model/permission.model.js';
import { Op } from 'sequelize';

const expiredPermissionDeletion = () => {
cron.schedule("*/1 * * * *", async () => {
    try {
        const currentTime = new Date();
        const deleted = await Permission.destroy(
            { 
            where: {  
                endTime: { [Op.lt]: currentTime }
            }
        });

        if(deleted>0){
            console.log(`Delete ${deleted} expired permissions`);
        }

    } catch (error) {
        console.error('Error executing cron job:', error);
    }
})

console.log("Cron job for deleting expired permissions is running.");
}

export { expiredPermissionDeletion };
