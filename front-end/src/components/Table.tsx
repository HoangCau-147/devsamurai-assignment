import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
  },
]

export function TableDemo() {
  return (
    <Table className='border-t-0'>
      <span className="block mb-4 w-full">Most visited contacts</span>
      <TableHeader>
        <TableRow>
          <TableHead className=""></TableHead>
          <TableHead className="ml-auto"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.invoice}>
            <TableCell className="font-medium">{invoice.invoice}</TableCell>
            <TableCell className="text-right">{invoice.paymentStatus}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
