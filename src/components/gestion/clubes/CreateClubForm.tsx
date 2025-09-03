
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { useRouter } from "next/navigation"

const createClubSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  logoUrl: z.string().url("Debe ser una URL válida para el logo"),
});

type CreateClubFormValues = z.infer<typeof createClubSchema>

export function CreateClubForm() {
    const { toast } = useToast()
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<CreateClubFormValues>({
        resolver: zodResolver(createClubSchema),
        defaultValues: {
            name: '',
            logoUrl: '',
        },
    });
    
    async function onSubmit(values: CreateClubFormValues) {
        setIsSubmitting(true)
        try {
            // Aquí iría la llamada a la server action para crear el club
            console.log(values);
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast({
                title: "Club Creado (Simulación)",
                description: `El club ${values.name} ha sido creado exitosamente.`,
            })
            form.reset()
            router.refresh()
        } catch (error) {
             toast({
                variant: "destructive",
                title: "Error al crear club",
                description: "No se pudo crear el club. Por favor, intente de nuevo.",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card>
            <CardContent className="pt-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre del Club</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ej: Futsaleros FC" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                         <FormField
                            control={form.control}
                            name="logoUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>URL del Logo</FormLabel>
                                     <FormControl>
                                        <Input placeholder="https://example.com/logo.png" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <Button type="submit" disabled={isSubmitting} className="w-full">
                            {isSubmitting ? 'Creando...' : 'Crear Club'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
