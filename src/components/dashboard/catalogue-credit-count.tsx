import { RequirementCatalogueMap, CatalogGroupMap } from "@/lib/definition";
import { Separator } from "../ui/separator";
import { Asterisk, CircleCheck } from "lucide-react";

interface CatalogueCreditCountProps {
    catalogue: string;
    requirementCatalogueMap: RequirementCatalogueMap;
}

export default function CatalogueCreditCount(
    { catalogue, requirementCatalogueMap }: CatalogueCreditCountProps) {
    if (catalogue === "none" || !requirementCatalogueMap[CatalogGroupMap.foundation]) {
        return <></>;
    }

    return (
        <div className="flex items-center space-x-4 text-sm max-md:text-xs max-md:flex-col justify-start px-4 mb-4">
            {
                catalogue === "All" || catalogue === "Requirements" ?
                    <>
                        <div className="flex gap-2 items-center">
                            <h3>Foundation</h3>
                            <p className="flex gap-1 items-center">
                                <Asterisk />{requirementCatalogueMap[CatalogGroupMap.foundation].minRequirement}
                            </p>
                            <p className="flex gap-1 items-center">
                                <CircleCheck />{requirementCatalogueMap[CatalogGroupMap.foundation].doneCredit}
                            </p>
                        </div>
                        <Separator orientation="vertical" className="h-4" />
                        <div className="flex gap-2 items-center">
                            <h3>Major</h3>
                            <p className="flex gap-1 items-center">
                                <Asterisk />{requirementCatalogueMap[CatalogGroupMap.major].minRequirement}
                            </p>
                            <p className="flex gap-1 items-center">
                                <CircleCheck />{requirementCatalogueMap[CatalogGroupMap.major].doneCredit}
                            </p>
                        </div>
                        <Separator orientation="vertical" className="h-4" />
                        <div className="flex gap-2 items-center">
                            <h3>Minor</h3>
                            <p className="flex gap-1 items-center">
                                <Asterisk />{requirementCatalogueMap[CatalogGroupMap.minor].minRequirement}
                            </p>
                            <p className="flex gap-1 items-center">
                                <CircleCheck />{requirementCatalogueMap[CatalogGroupMap.minor].doneCredit}
                            </p>
                        </div>
                    </>
                    :
                    <div className="flex gap-2 items-center">
                        <h3>{catalogue}</h3>
                        <p className="flex gap-1 items-center">
                            <Asterisk />
                            {requirementCatalogueMap[CatalogGroupMap[catalogue.toLowerCase()]].minRequirement}
                        </p>
                        <p className="flex gap-1 items-center">
                            <CircleCheck />
                            {requirementCatalogueMap[CatalogGroupMap[catalogue.toLowerCase()]].doneCredit}
                        </p>
                    </div>
            }
        </div>
    );
}