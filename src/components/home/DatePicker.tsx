import { useContext, useEffect } from "react";
import { DataContext } from "../../context/DataContext";

export default function DatePicker() {
  const { selectedDate, setSelectedDate,setFormatedDate } = useContext(DataContext);

  function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const day = date.getDate().toString().padStart(2, '0');
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  setFormatedDate(`${day}-${month}-${year}`);
}


const handleDateChange = (e:any)=> {
setSelectedDate(e.target.value);
formatDate(e.target.value);
}

useEffect(()=>{

},[]);

  return (
    <input
      type="date"
      className="w-4/5 mt-5 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      value={selectedDate || ""}
      onChange={handleDateChange}
    />
  );
}
