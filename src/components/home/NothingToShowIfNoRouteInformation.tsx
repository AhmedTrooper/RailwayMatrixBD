import { Alert } from "@heroui/alert";

export default function NothingToShowIfNoRouteInformation(){
    return(<div className="w-full grid justify-items-center items-center content-center">
        <Alert color="danger">No Route information is found </Alert>
    </div>)
}