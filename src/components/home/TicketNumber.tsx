import { useMatrixStore } from "@/store/matrixStore";
import { Alert } from "@heroui/alert";
import { useEffect } from "react";

export default function TicketNumber(){
const numberOfTicketFound = useMatrixStore((state)=>state.numberOfTicketFound);
useEffect(()=>{},[numberOfTicketFound])
    return(<div className="w-full grid items-center justify-items-center mt-4 mb-4 md:w-1/2">
        <Alert color="success">Ticket found for : {numberOfTicketFound} routes</Alert>
    </div>);
}