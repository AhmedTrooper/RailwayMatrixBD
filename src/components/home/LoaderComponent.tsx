import { Spinner } from "@heroui/react";


export default function LoaderComponent(){
    return(<div className="h-28 grid justify-items-center items-center sm:col-span-2 mt-4 mb-4">
        <Spinner color="primary" label="Finding Trains" labelColor="primary" />
    </div>);
}