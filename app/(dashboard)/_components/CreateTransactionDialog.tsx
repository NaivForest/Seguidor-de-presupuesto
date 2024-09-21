"use client";

import { TransactionType } from '../../../lib/type'
import { ReactNode, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '../../../components/ui/dialog'
import { cn } from '../../../lib/utils'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../../../components/ui/form'
import { Input } from '../../../components/ui/input'


interface Props {
    trigger: ReactNode;
    type: TransactionType;
}

import React from 'react'
import { CreateTransactionSchema, CreateTransactionSchemaType } from '../../../schema/transaction';
import CategoryPicker from './CategoryPicker';
import { handleClientScriptLoad } from 'next/script';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from '@/components/ui/calendar';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateTransaction } from "../_actions/transactions";
import { toast } from "sonner";
import { DateToUTCDate } from "../../../lib/helpers";

function CreateTransactionDialog({ trigger, type }: Props) {
    const form = useForm<CreateTransactionSchemaType>({
        resolver: zodResolver(CreateTransactionSchema),
        defaultValues: {
            type,
            date: new Date()
        }
    });

    const [open, setOpen] = React.useState(false)

    const handleCategoryChange = useCallback((value: string) => {
        form.setValue("category", value)
    }, [form]);

    const queryClient = useQueryClient();

    const {mutate, isPending} = useMutation({
        mutationFn: CreateTransaction,
        onSuccess: () => {
            toast.success("¡Gestión realizada con éxito 🎉!", {
                id: "create-transaction"
            });

            form.reset({
                type,
                description: "",
                amount: 0,
                date: new Date(),
                category: undefined
            });

            // Después de realizar la gestión, se necesita validar el overview query que hará refetch a la data de la pantaña de inicio
            queryClient.invalidateQueries({
                queryKey: ["overview"]
            });

            setOpen((prev) => !prev);
        },
    });

    const onSubmit = useCallback((values: CreateTransactionSchemaType) => {
        toast.loading("Creando gestión...", {
            id: "create-transaction"
        });
        mutate({
            ...values,
            date: DateToUTCDate(values.date),
        })
    }, [mutate]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    Crear un nuevo<span className={cn(
                        "m-1",
                        type === "ingreso" ? "text-emerald-500" : "text-red-500"
                    )}>{ type }</span>
                     para el presupuesto
                </DialogTitle>
            </DialogHeader>
            <Form {...form}>
                <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
                    {/* FieldBox para descripción */}
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Descripción</FormLabel>
                                <FormControl>
                                    <Input defaultValue={""} {...field} />
                                </FormControl>
                                <FormDescription>
                                    Descripción del ingreso (optional)
                                </FormDescription>
                            </FormItem>
                        )}
                    />

                    {/* FieldBox para el monto */}
                    <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Monto</FormLabel>
                                <FormControl>
                                    <Input defaultValue={0.00} type='number' {...field} />
                                </FormControl>
                                <FormDescription>
                                    Monto a ingresar (Solo números)
                                </FormDescription>
                            </FormItem>
                        )}
                    />
                    {/* FieldBox para categoría */}
                    <div className="flex items-center justify-between gap-2">
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem className='flex flex-col'>
                                    <FormLabel>Categoría</FormLabel>
                                    <FormControl>
                                        <CategoryPicker type={type} onChange={handleCategoryChange} />
                                    </FormControl>
                                    <FormDescription>
                                        Seleciona una categoría
                                    </FormDescription>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem className='flex flex-col'>
                                    <FormLabel>Fecha del ingreso</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button variant={"outline"} className={cn(
                                                    "w-[200px] pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}>
                                                    {field.value ? (
                                                        format(field.value, "PPP")
                                                    ) : (
                                                        <span>Selecciona una fecha</span>
                                                    )}
                                                    <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className='w-auto p-0'>
                                            <Calendar 
                                                mode='single' 
                                                selected={field.value}
                                                onSelect={value => {
                                                    if (!value) return;
                                                    field.onChange(value);
                                                }}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormDescription>
                                        Seleciona una fecha para el ingreso
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
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

export default CreateTransactionDialog