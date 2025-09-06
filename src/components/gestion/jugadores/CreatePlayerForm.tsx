
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Team } from "@/types"

const createPlayerSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  number: z.coerce.number().min(0, "El número no puede ser negativo"),
  position: z.enum(["GOLERO", "DEFENSA", "ALA", "PIVOT"]),
  teamId: z.string().min(1, "Debe seleccionar un equipo"),
  avatarUrl: z.string().optional(),
});

type CreatePlayerFormValues = z.infer<typeof createPlayerSchema>

interface CreatePlayerFormProps {
    teams: Team[]
}

export function CreatePlayerForm({ teams }: CreatePlayerFormProps) {
    const { toast } = useToast()
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<CreatePlayerFormValues>({
        resolver: zodResolver(createPlayerSchema),
        defaultValues: {
            name: '',
            number: 0,
            position: "ALA",
            teamId: '',
            avatarUrl: ''
        },
    });
    
    async function onSubmit(values: CreatePlayerFormValues) {
        setIsSubmitting(true)
        try {
            // Aquí iría la llamada a la server action para crear el jugador
            console.log({
                ...values,
                teamId: parseInt(values.teamId)
            });
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast({
                title: "Jugador Creado (Simulación)",
                description: `El jugador ${values.name} ha sido creado exitosamente.`,
            })
            form.reset()
            router.refresh()
        } catch (error) {
             toast({
                variant: "destructive",
                title: "Error al crear jugador",
                description: "No se pudo crear el jugador. Por favor, intente de nuevo.",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nombre del Jugador</FormLabel>
                            <FormControl>
                                <Input placeholder="Ej: Juan Pérez" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="teamId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Equipo</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger><SelectValue placeholder="Seleccione un equipo" /></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {teams.map(team => (
                                        <SelectItem key={team.id} value={String(team.id)}>{team.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="number"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Número de Camiseta</FormLabel>
                             <FormControl>
                                <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Posición</FormLabel>
                             <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger><SelectValue placeholder="Seleccione una posición" /></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="GOLERO">Golero</SelectItem>
                                    <SelectItem value="DEFENSA">Defensa</SelectItem>
                                    <SelectItem value="ALA">Ala</SelectItem>
                                    <SelectItem value="PIVOT">Pivot</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="avatarUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>URL del Avatar</FormLabel>
                             <FormControl>
                                <Input placeholder="/avatar/1.png" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                
                <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? 'Creando...' : 'Crear Jugador'}
                </Button>
            </form>
        </Form>
    )
}
