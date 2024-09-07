import {DashboardMain} from "../../../components/Dashboard/DashboardMain";
import CreateNotification from "../../../components/Notification/create/CreateNotification";


export function NotificationCreate(props) {
    return (
        <>
            <DashboardMain content={<CreateNotification/>}/>
        </>
    )
}