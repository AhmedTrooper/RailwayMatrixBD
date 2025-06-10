import { useTrainStore } from "@/store/trainStore";
import { Alert } from "@heroui/alert";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { isEmpty } from "lodash";
import { useEffect } from "react";

export default function TrainInformation() {
  const trainInformaton = useTrainStore((state) => state.trainInformaton);
  const calculateOffDays = useTrainStore((state) => state.calculateOffDays);
  const offDays = useTrainStore((state) => state.offDays);

  useEffect(() => {
    if (trainInformaton) {
      calculateOffDays();
    }
  }, [trainInformaton]);

  return (
    <div className="w-full md:w-3/5 lg:w-4/5  grid justify-items-center items-center content-center justify-self-center ">
      <Card className="md:w-4/5 w-full  sm:w-3/5">
        <CardHeader>{trainInformaton?.train_name}</CardHeader>

        {(!isEmpty(trainInformaton!.days) || !isEmpty(offDays)) && (
          <CardBody>
            {!isEmpty(trainInformaton!.days) && (
              <div>
                <Alert
                  color="success"
                  className="mt-2 mb-2"
                >
                  On Day{" "}
                </Alert>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {trainInformaton!.days.map((day, index) => (
                    <span
                      key={index}
                      className="text-center font-medium  p-2 border rounded dark:border-zinc-600"
                    >
                      {day}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {isEmpty(offDays) && (
              <Alert
                color="success"
                className="mt-2 mb-2"
              >
                No off day is found
              </Alert>
            )}

            {!isEmpty(offDays) && (
              <div>
                <Alert
                  color="danger"
                  className="mt-2 mb-2"
                >
                  Off Day{" "}
                </Alert>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {offDays.map((day, index) => (
                    <span
                      key={index}
                      className="text-center font-medium  p-2 border rounded dark:border-zinc-600"
                    >
                      {day}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardBody>
        )}

        <CardFooter>
          Total Duration : {trainInformaton?.total_duration} hours
        </CardFooter>
      </Card>
    </div>
  );
}
