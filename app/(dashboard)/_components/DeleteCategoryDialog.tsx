"use client";

import { Category } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { ReactNode } from 'react'
import { DeleteCategory } from '../_actions/categories';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../../../components/ui/alert-dialog";
import { TransactionType } from '../../../lib/type';

interface Props {
    trigger: ReactNode;
    category: Category;
}

function DeleteCategoryDialog({category, trigger}: Props) {
    const categoryIdentifier = `${category.name}-${category.type}`;
    const queryClient = useQueryClient();
    const deleteMutation = useMutation({
        mutationFn: DeleteCategory,
        onSuccess: async () => {
            toast.success("Se ha eliminado la categoría con éxito", {
                id: categoryIdentifier
            })

            await queryClient.invalidateQueries({
                queryKey: ["categories"],
            })
        },
        onError: () => {
            toast.error("¡Ups! Algo salió mal. Intentalo nuevamente", {
                id: categoryIdentifier,
            })
        }
    })
  return (
    <AlertDialog>
        <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>Esta acción será permanente</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={() => {
                    toast.loading("Eliminando categoría...", {
                        id: categoryIdentifier,
                    });
                    deleteMutation.mutate({
                        name: category.name,
                        type: category.type as TransactionType,
                    })
                }}>
                    Eliminar
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteCategoryDialog;