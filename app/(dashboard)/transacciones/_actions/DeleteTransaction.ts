"use server";

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "../../../../lib/prisma";

export async function DeleteTransaction(id: string) {
    const user = await currentUser();
    if (!user) {
        redirect("/sign-in");
    }

    const transaction = await prisma.transaction.findUnique({
        where: {
            userId: user.id,
            id,
        }
    });
    if (!transaction) {
        throw new Error("Error en la solicitud...");
    }

    await prisma.$transaction([
        // Eliminar la transacción en la base de datos
        prisma.transaction.delete({
            where: {
                id,
                userId: user.id,
            }
        }),
        // Actualizar el historial mensual
        prisma.monthHistory.update({
            where: {
                day_month_year_userId: {
                    userId: user.id,
                    day: transaction.date.getUTCDate(),
                    month: transaction.date.getUTCMonth(),
                    year: transaction.date.getUTCFullYear(),
                },
            },
            data: {
                ...(transaction.type === "expense" && {
                    expense: {
                        decrement: transaction.amount,
                    },
                }),
                ...(transaction.type === "income" && {
                    income: {
                        decrement: transaction.amount,
                    },
                }),
            },
        }),
        // Actualizar el historial anual
        prisma.yearHistory.update({
            where: {
                month_year_userId: {
                    userId: user.id,
                    month: transaction.date.getUTCMonth(),
                    year: transaction.date.getUTCFullYear(),
                },
            },
            data: {
                ...(transaction.type === "expense" && {
                    expense: {
                        decrement: transaction.amount,
                    },
                }),
                ...(transaction.type === "income" && {
                    income: {
                        decrement: transaction.amount,
                    },
                }),
            },
        }),
    ])
}