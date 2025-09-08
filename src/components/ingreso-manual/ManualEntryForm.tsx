
'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { FullMatch, Player, Team } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';


const eventSchema = z.object({
  type: z.enum(['GOAL', 'ASSIST', 'YELLOW_CARD', 'RED_CARD']),
  playerId: z.string().min(1, 'Debe seleccionar un jugador'),
  teamId: z.number(),
  minute: z.coerce.number().min(0).max(40),
});

const manualEntrySchema = z.object({
  scoreA: z.coerce.number().min(0),
  scoreB: z.coerce.number().min(0),
  foulsA: z.coerce.number().min(0),
  foulsB: z.coerce.number().min(0),
  events: z.array(eventSchema),
});

type ManualEntryFormValues = z.infer<typeof manualEntrySchema>;

interface ManualEntryFormProps {
  match: FullMatch;
}

export function ManualEntryForm({ match }: ManualEntryFormProps) {
    const { toast } = useToast();
    const allPlayers = [...match.teamA.players, ...match.teamB.players];

    const form = useForm<ManualEntryFormValues>({
        resolver: zodResolver(manualEntrySchema),
        defaultValues: {
            scoreA: match.scoreA || 0,
            scoreB: match.scoreB || 0,
            foulsA: match.foulsA || 0,
            foulsB: match.foulsB || 0,
            events: [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'events',
    });

    function getPlayerTeamId(playerId: string): number | undefined {
        const player = allPlayers.find(p => String(p.id) === playerId);
        return player?.teamId;
    }

    const onSubmit = (data: ManualEntryFormValues) => {
        console.log(data);
        toast({
            title: 'Datos enviados (Simulación)',
            description: <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4"><code className="text-white">{JSON.stringify(data, null, 2)}</code></pre>,
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Resultado Final</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="scoreA"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>{match.teamA.name}</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="scoreB"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>{match.teamB.name}</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Estadísticas del Partido</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="foulsA"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Faltas de {match.teamA.name}</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="foulsB"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Faltas de {match.teamB.name}</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader>
                        <CardTitle>Eventos de Jugadores</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {fields.map((field, index) => (
                            <div key={field.id} className="p-4 border rounded-lg space-y-4 relative">
                                 <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-2 right-2 text-destructive hover:bg-destructive/10"
                                    onClick={() => remove(index)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                     <FormField
                                        control={form.control}
                                        name={`events.${index}.type`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tipo de Evento</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="GOAL">Gol</SelectItem>
                                                        <SelectItem value="ASSIST">Asistencia</SelectItem>
                                                        <SelectItem value="YELLOW_CARD">Tarjeta Amarilla</SelectItem>
                                                        <SelectItem value="RED_CARD">Tarjeta Roja</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`events.${index}.playerId`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Jugador</FormLabel>
                                                <Select
                                                    onValueChange={(value) => {
                                                        field.onChange(value);
                                                        const teamId = getPlayerTeamId(value);
                                                        if (teamId) {
                                                            form.setValue(`events.${index}.teamId`, teamId);
                                                        }
                                                    }}
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                                    <SelectContent>
                                                        {allPlayers.map(p => (
                                                            <SelectItem key={p.id} value={String(p.id)}>{p.name} ({p.teamId === match.teamA.id ? match.teamA.name.substring(0,3) : match.teamB.name.substring(0,3)})</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`events.${index}.minute`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Minuto</FormLabel>
                                                <FormControl><Input type="number" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        ))}
                         <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => append({ type: 'GOAL', playerId: '', teamId: 0, minute: 0 })}
                        >
                           <PlusCircle className="mr-2 h-4 w-4" />
                            Añadir Evento
                        </Button>
                    </CardContent>
                </Card>

                <Button type="submit" className="w-full" size="lg">Guardar Datos del Partido</Button>
            </form>
        </Form>
    );
}
