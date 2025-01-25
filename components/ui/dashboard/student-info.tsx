import { getStudentCatalogues, getStudentInfo } from "@/lib/apis";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, extractCreditCompletionData } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

export default async function StudentInfo({className}: {className?: string}) {
    const info = await getStudentInfo();
    const catalogues = await getStudentCatalogues();
    
    const cgpa = catalogues?.[0].cgpa || 0.0;
    const creditEarned = catalogues?.[0].creditEarned || 0.0;   
    const catalogueData = extractCreditCompletionData(catalogues);

    return (
        <div className={cn("flex justify-between items-start max-sm:flex-col max-sm:gap-4", className)}>
            <div className="flex flex-col gap-2 max-sm:w-full">
                <div className="flex gap-2 items-end">
                    <Avatar>
                        <AvatarImage
                            src={`https://iras.iub.edu.bd:8079/photo/${info?.data.studentId}.jpg`}
                            alt={`${info?.data.studentName}`}
                        />
                        <AvatarFallback>
                            <User />
                        </AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-semibold">{info?.data.studentName}</h3>
                </div>

                <span className="flex items-center justify-between gap-2 bg-muted/55 rounded p-2">
                    <p className="text-sm">{info?.data.major}</p>
                    <p className="text-sm font-semibold text-foreground bg-muted-foreground/30 rounded p-1 size-fit">Major</p>
                </span>
                <span className="flex items-center justify-between gap-2 bg-muted/55 rounded p-2">
                    <p className="text-sm">{info?.data.minor}</p>
                    <p className="text-sm font-semibold text-foreground bg-muted-foreground/30 rounded p-1 size-fit">Minor</p>
                </span>
            </div>

            <div className="flex gap-4 max-sm:flex-col max-sm:w-full">
                <Card>
                    <CardHeader>
                        <CardTitle>RESULT</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <span className="flex gap-2 text-xl">
                            <p className="font-semibold text-muted-foreground">CGPA:</p>
                            <p>{cgpa}</p>
                        </span>
                        <span className="flex gap-2 text-sm">
                            <p className="font-semibold text-muted-foreground">Credit Earned:</p>
                            <p>{creditEarned}</p>
                        </span>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>COMPLETED CREDIT</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        {
                            Object.keys(catalogueData).map((key, idx) => (
                                <span key={key} className={cn("flex gap-2", {"col-span-2": idx === 4})}>
                                    <p className="font-semibold text-muted-foreground">{key}:</p>
                                    <p>{catalogueData[key].doneCredit}/{catalogueData[key].maxReq}</p>
                                </span>
                            ))
                        }
                    </CardContent>
                </Card>
            </div>

        </div>
    );
}
