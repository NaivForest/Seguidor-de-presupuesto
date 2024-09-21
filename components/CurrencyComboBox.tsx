"use client"

import * as React from "react"

import { useMediaQuery } from "../hooks/use-media-query"
import { Button } from "./ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command"
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "./ui/drawer"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover"
import { Currencies, Currency } from '../lib/currencies'
import { useQuery, useMutation } from '@tanstack/react-query'
import SkeletonWrapper from "./SkeletonWrapper"
import { UserSettings } from '@prisma/client'
import { UpdateUserCurrency } from "../app/wizard/_actions/userSettings"
import { toast } from 'sonner';

export function CurrencyComboBox() {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [selectedOption, setSelectedOption] = React.useState<Currency | null>(
    null
  );

  const userSettings = useQuery< UserSettings >({
    queryKey: ["userSettings"],
    queryFn: () => fetch("/api/user-settings").then((res) => res.json()),
  });

  React.useEffect(() => {
    if (!userSettings.data) return;
    const userCurrency = Currencies.find(
        (currency) => currency.value === userSettings.data.currency
    );
    if (userCurrency) setSelectedOption(userCurrency);
  }, [userSettings.data]);

  const mutation = useMutation({
    mutationFn: UpdateUserCurrency,
    onSuccess: (data: UserSettings) => {
        toast.success(`¡Se actualizaron tus preferencias! 💪`, {
            id: "update-currency",
        });

        setSelectedOption(
            Currencies.find((c) => c.value === data.currency) || null
        )
    },
    onError: (e) => {
        toast.error("¡Ups! Algo salió mal. Intentalo nuevamente", {
            id: "update-currency",
        })
    }
  });

  const selectOption = React.useCallback((currency:Currency | null) => {
        if (!currency) {
            toast.error("Por favor selecciona un tipo de moneda");
            return;
        };
        toast.loading("Actualizando tus preferencias...", {
            id: "update-currency",
        });

        mutation.mutate(currency.value);
    }, [mutation]
    );

  if (isDesktop) {
    return (
      <SkeletonWrapper isLoading={userSettings.isFetching}>
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start" disabled={mutation.isPending}>
                {selectedOption ? <>{selectedOption.label}</> : <>+ Monedas</>}
            </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
            <OptionList setOpen={setOpen} setSelectedOption={selectOption} />
            </PopoverContent>
        </Popover>
      </SkeletonWrapper>
    )
  }

  return (
    <SkeletonWrapper isLoading={userSettings.isFetching}>
        <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
            <Button variant="outline" className="w-full justify-start" disabled={mutation.isPending}>
            {selectedOption ? <>{selectedOption.label}</> : <>+ Monedas</>}
            </Button>
        </DrawerTrigger>
        <DrawerContent>
            <div className="mt-4 border-t">
            <OptionList setOpen={setOpen} setSelectedOption={selectOption} />
            </div>
        </DrawerContent>
        </Drawer>
    </SkeletonWrapper>
  )
}

function OptionList({
  setOpen,
  setSelectedOption,
}: {
  setOpen: (open: boolean) => void
  setSelectedOption: (status: Currency | null) => void
}) {
  return (
    <Command>
      <CommandInput placeholder="Filtrar por moneda..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {Currencies.map((currency: Currency) => (
            <CommandItem
              key={currency.value}
              value={currency.value}
              onSelect={(value) => {
                setSelectedOption(
                  Currencies.find((priority) => priority.value === value) || null
                )
                setOpen(false)
              }}
            >
              {currency.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
