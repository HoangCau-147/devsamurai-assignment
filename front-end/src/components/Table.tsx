import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ArrowRight } from "lucide-react";

export type ContactItem = {
  id: string;
  name: string;
  avatar?: string | null;
  count: number;
};

interface Props {
  title?: string;
  items?: ContactItem[];
  className?: string;
}

export function TableVisit({
  title = "Most visited contacts",
  items = [],
  className = "",
}: Props) {
  return (
    <div className="rounded-2xl border border-solid overflow-hidden w-full p-6">
      <Table className={`${className}`}>
        <div className="block w-full font-medium mb-6">{title}</div>
  
        <TableBody>
          {items.map((item) => (
            <TableRow
              key={item.id}
              className="group hover:bg-muted/30 transition-colors duration-150 border-b-0"
            >
              <TableCell className="font-medium first:rounded-l-sm last:rounded-r-rounded-l-sm">
                <div className="flex items-center gap-3 ">
                  <Avatar className="h-5 w-5 text-gray-500">
                    {item.avatar ? (
                      <AvatarImage src={item.avatar} alt={item.name} />
                    ) : (
                      <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                    )}
                  </Avatar>
                  <span className="truncate">{item.name}</span>
                </div>
              </TableCell>
  
              <TableCell className="text-right first:rounded-l-sm last:rounded-r-rounded-l-sm">
                <div className="relative inline-block w-3 h-3">
                  <span className="absolute inset-0 flex items-center justify-end transition-opacity duration-150 group-hover:opacity-0">
                    {item.count}
                  </span>
                  <span className="absolute inset-0 flex items-center justify-end opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                    <ArrowRight className="size-4" />
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
