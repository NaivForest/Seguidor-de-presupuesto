"use client";

import React, { ReactNode, useCallback, useState } from 'react'
import { TransactionType } from '../../../lib/type';
import { useForm } from 'react-hook-form';
import { CreateCategorySchema, CreateCategorySchemaType } from '../../../schema/categories';
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog";
import { Button } from '../../../components/ui/button';
import { PlusSquare } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "../../../components/ui/form";
import { Input } from '../../../components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '../../../components/ui/popover';
import { CircleOff, Loader2 } from "lucide-react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateCategory } from '../_actions/categories';
import { Category } from "@prisma/client";
import { toast } from "sonner";
import { useTheme } from "next-themes";

interface Props {
    type: TransactionType;
    successCallback: (category: Category) => void;
    trigger?: ReactNode; 
}

function CreateCategoryDialog({ type, successCallback, trigger }: Props) {
    const [open, setOpen] = React.useState(false);
    const form = useForm<CreateCategorySchemaType>({
        resolver: zodResolver(CreateCategorySchema),
        defaultValues: {
            type,
        }
    });

    const queryClient = useQueryClient();
    const theme = useTheme();

    const {mutate, isPending} = useMutation({
        mutationFn: CreateCategory,
        onSuccess: async (data: Category) => {
            form.reset({
                name: "",
                icon: "",
                type,
            });

            toast.success(`¡Categoría '${data.name}' creada con éxito!🎉`, {
                id: "create-category"
            });

            successCallback(data);

            await queryClient.invalidateQueries({
                queryKey: ["categories"],
            });

            setOpen((prev) => !prev);
        },
        onError: () => {
            toast.error("¡Ups! Algo salió mal. Intentalo nuevamente", {
                id: "create-category"
            })
        }
    });

    const onSubmit = useCallback((values: CreateCategorySchemaType) => {
        toast.loading("Creando nueva categoría...", {
            id: "create-category"
        });
        mutate(values);
    }, [mutate]);


  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            { trigger ? (trigger) : (<Button variant={"ghost"} className='flex border-separate items-center justify-start rounded-none border-b px-3 py-3 text-muted-foreground'>
                <PlusSquare className='mr-2 h-4 w-4' />
                Crear una nueva
            </Button>)}
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    Crear nueva categoría para este<span className={ cn(
                        "m-1",
                        type === "ingreso" ? "text-emerald-500" : "text-red-500"
                    )}>{type}</span>
                </DialogTitle>
                <DialogDescription>
                    Las categorías se utilizan para agrupar tus ingresos y gastos.
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre</FormLabel>
                                <FormControl>
                                    <Input placeholder='Universidad, vehículo, proyectos...' {...field} />
                                </FormControl>
                                <FormDescription>
                                    Tu categoría aparecerá con este nombre
                                </FormDescription>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="icon"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Emoji</FormLabel>
                                <FormControl>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant={"outline"} className='h-[100px] w-full'>
                                                {form.watch("icon") ? (
                                                    <div className='flex flex-col items-center gap-2'>
                                                        <span className="text-5xl" role='img'>{field.value}</span>
                                                        <p className="text-xs text-muted-foreground">Haz clic para cambiar el Emoji</p>
                                                    </div>
                                                ) : (
                                                    <div className='flex flex-col items-center gap-2'>
                                                        <CircleOff className='h-[48px] w-[48px]' />
                                                        <p className="text-xs text-muted-foreground">Haz clic para seleccionar un Emoji</p>
                                                    </div>
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className='w-full'>
                                            <Picker 
                                                data={data} 
                                                theme={theme.resolvedTheme}
                                                onEmojiSelect={(emoji: {native: string}) => {
                                                    field.onChange(emoji.native);
                                                }}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </FormControl>
                                <FormDescription>
                                    Este Emoji aparecerá en tu nueva categoría
                                </FormDescription>
                            </FormItem>
                        )}
                    />
                </form>
            </Form>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type='button' variant={"secondary"} onClick={() => {
                        form.reset();
                    }}>
                        Cancelar
                    </Button>
                </DialogClose>
                <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending}>
                    {!isPending && "Crear"}
                    {isPending && <Loader2 className='animate-ping' />}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}

export default CreateCategoryDialog