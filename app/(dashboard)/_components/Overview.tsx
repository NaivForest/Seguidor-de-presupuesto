"use client";

import React from 'react'
import { UserSettings } from "@prisma/client";
import { startOfMonth, differenceInDays } from "date-fns";
import { DateRangePicker } from "../../../components/ui/date-range-picker";
import { MAX_DATE_RANGE_DAYS } from "../../../lib/constants";
import { toast } from "sonner";
import StatsCards from "./StatsCards";
import CategoriesStats from "./CategoriesStats";

function Overview({userSettings}: {userSettings: UserSettings}) {
    const [dateRange, setDateRange] = React.useState<{from: Date; to: Date}>({
        from: startOfMonth(new Date()),
        to: new Date(),
    })
  return (
    <>
        <div className="container flex flex-wrap items-end justify-between gap-2 py-6">
            <h2 className="text-3xl font-bold">Vista general</h2>
            <div className="flex items-center gap-3">
                <DateRangePicker
                    initialDateFrom={dateRange.from}
                    initialDateTo={dateRange.to}
                    showCompare={false}
                    onUpdate={(values) => {
                        // Se actualiza la fecha solamente si ambas fechas se establecen
                        const {from, to} = values.range;

                        if (!from || !to) return;
                        if (differenceInDays(to, from) > MAX_DATE_RANGE_DAYS) {
                            toast.error(`El rango seleccionado es demasiado grande 😠. El máximo permitido es de ${MAX_DATE_RANGE_DAYS} días 😒`);
                            return;
                        }

                        setDateRange({ from, to });
                    }}
                />
            </div>
        </div>
        <div className="container flex w-full flex-col gap-2">
            <StatsCards
                userSettings={userSettings}
                from={dateRange.from}
                to={dateRange.to}
            />
            <CategoriesStats 
                userSettings={userSettings}
                from={dateRange.from}
                to={dateRange.to}
            />
        </div>
    </>
  )
}

export default Overview