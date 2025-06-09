import { Alert } from "@heroui/alert";
export default function OnlyTrainSelectionError(){
    return(<div className="grid w-full  md:w-3/5 items-center justify-items-center sm:col-span-2">
<Alert color="warning">Select a journey date too</Alert>
    </div>);
}