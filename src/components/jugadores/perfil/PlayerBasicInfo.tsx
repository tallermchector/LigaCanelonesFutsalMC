
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const StatRow = ({ label, value, unit }: { label: string; value: string | number; unit?: string }) => (
    <div className="flex items-baseline justify-between px-6 py-4">
        <p className="text-sm font-semibold text-muted-foreground">{label}</p>
        <p className="text-3xl font-bold text-red-500">
            {value} <span className="text-lg text-muted-foreground">{unit}</span>
        </p>
    </div>
);


export function PlayerBasicInfo() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Información Básica
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0 divide-y">
                <StatRow label="EDAD:" value={28} />
                <StatRow label="ALTURA:" value={190} unit="CM" />
                <StatRow label="PESO:" value={88} unit="KG" />
            </CardContent>
        </Card>
    )
}
