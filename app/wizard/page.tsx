import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';
import React, { use } from 'react'
import { Separator } from '../../components/ui/separator'
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import Link from 'next/link';
import Logo, { LogoMobile } from '../../components/Logo'
import { CurrencyComboBox } from '../../components/CurrencyComboBox'

async function page() {
    {/*"Leer el usuario de Clerk"*/}
    const user = await currentUser();
    if (!user) {
        redirect("/sign-in")
    }

  return (
    <div className='container flex max-w-2xl flex-col items-center justify-between gap-4'>
        <div className="mt-8 ">
            <LogoMobile />
        </div>
        <div className="">
            <h1 className="text-center text-3xl">
                ¡Hola, <span className="ml-2 font-bold">{user.firstName} 👋</span>!
            </h1>
            <h2 className="mt-4 text-center text-base text-muted-foreground">
                Iniciemos definiendo tu moneda
            </h2>
            <h3 className="mt-2 text-center text-sm text-muted-foreground">
                Puedes cambiar esta configuración en cualquier momento
            </h3>
        </div>
        <Separator />
        <Card className='w-full'>
            <CardHeader>
                <CardTitle>Moneda</CardTitle>
                <CardDescription>Selecciona tu moneda local para usar en el sistema</CardDescription>
                <CardContent>
                    <CurrencyComboBox />
                </CardContent>
            </CardHeader>
        </Card>
        <Separator />
        <Button className='w-full' asChild>
            <Link href={"/"}>
                ¡Estoy listo! Llevame al Dashboard
            </Link>
        </Button>
        
    </div>
  )
}

export default page