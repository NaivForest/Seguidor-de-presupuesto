"use client";

import React from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../../../components/ui/alert-dialog";
import { DeleteTransaction } from "../_actions/DeleteTransaction";

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    transactionId: string;
}

function DeleteTransactionDialog({open, setOpen, transactionId}: Props) {
    const queryClient = useQueryClient();
    const deleteMutation = useMutation({
        mutationFn: DeleteTransaction,
        onSuccess: async () => {
            toast.success("Se ha eliminado la transacción con éxito", {
                id: transactionId
            })

            await queryClient.invalidateQueries({
                queryKey: ["transactions"],
            })
        },
        onError: () => {
            toast.error("¡Ups! Algo salió mal. Intentalo nuevamente", {
                id: transactionId,
            })
        }
    })
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>Esta acción será permanente</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={() => {
                    toast.loading("Eliminando transacción...", {
                        id: transactionId,
                    });
                    deleteMutation.mutate(transactionId)
                }}>
                    Eliminar
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteTransactionDialog;