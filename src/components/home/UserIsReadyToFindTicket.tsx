import { Alert } from "@heroui/alert";

export default function UserIsReadyToFindTicket(){
    return(<div className="w-full sm:w-3/5">
        <Alert color="success">You are ready to find tickets!</Alert>
    </div>);
}