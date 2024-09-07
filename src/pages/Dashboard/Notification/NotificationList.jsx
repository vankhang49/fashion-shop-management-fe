import {DashboardMain} from "../../../components/Dashboard/DashboardMain";
import ListOfNotification from "../../../components/Notification/list/ListOfNotification";
import {useParams} from "react-router-dom";

export function NotificationList(props) {
    const {role} = useParams();
    return (
        <>
            <DashboardMain path={role} content={<ListOfNotification/>}/>
        </>
    )
}