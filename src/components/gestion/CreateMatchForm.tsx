
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
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Team } from "@/types"
import { createMatch } from "@/actions/prisma-actions"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { useRouter } from "next/navigation"

const createMatchSchema = z.object({
  teamAId: z.string().min(1, "Debe seleccionar el equipo local"),
  teamBId: z.string().min(1, "Debe seleccionar el equipo visitante"),
  scheduledTime: z.date({
    required_error: "Debe seleccionar una fecha y hora.",
  }),
  round: z.coerce.number().min(1, "La jornada debe ser al menos 1"),
}).refine(data => data.teamAId !== data.teamBId, {
    message: "Los equipos no pueden ser los mismos",
    path: ["teamBId"],
});

type CreateMatchFormValues = z.infer<typeof createMatchSchema>

interface CreateMatchFormProps {
    teams: Team[]
}

export function CreateMatchForm({ teams }: CreateMatchFormProps) {
    const { toast } = useToast()
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<CreateMatchFormValues>({
        resolver: zodResolver(createMatchSchema),
        defaultValues: {
            teamAId: '',
            teamBId: '',
            scheduledTime: new Date(),
            round: 1,
        },
    });
    
    async function onSubmit(values: CreateMatchFormValues) {
        setIsSubmitting(true)
        try {
            await createMatch({
                ...values,
                teamAId: parseInt(values.teamAId),
                teamBId: parseInt(values.teamBId),
            })
            toast({
                title: "Partido Creado",
                description: "El nuevo partido ha sido programado exitosamente.",
            })
            form.reset()
            router.refresh() // Re-fetch server-side props
        } catch (error) {
             toast({
                variant: "destructive",
                title: "Error al crear partido",
                description: "No se pudo crear el partido. Por favor, intente de nuevo.",
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
                            name="teamAId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Equipo Local</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                            name="teamBId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Equipo Visitante</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                            name="scheduledTime"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Fecha y Hora</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "PPP HH:mm", { locale: es })
                                                    ) : (
                                                        <span>Seleccione una fecha</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) => date < new Date()}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                         <FormField
                            control={form.control}
                            name="round"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Jornada</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="Número de jornada" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <Button type="submit" disabled={isSubmitting} className="w-full">
                            {isSubmitting ? 'Creando...' : 'Crear Partido'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
