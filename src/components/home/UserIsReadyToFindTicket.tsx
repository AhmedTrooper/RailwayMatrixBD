import { Alert } from "@heroui/alert";

export default function UserIsReadyToFindTicket(){
    return(<div className="w-60 sm:w-96">
        <Alert color="success">You are ready to find tickets!</Alert>
    </div>);
}