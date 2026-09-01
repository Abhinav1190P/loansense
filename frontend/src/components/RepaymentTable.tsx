import type { ScheduleRow } from "../types";

function formatRupees(value: number) {
  return `₹${value.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

interface Props {
  schedule: ScheduleRow[];
}

export default function RepaymentTable({ schedule }: Props) {
  if (schedule.length === 0) return null;

  return (
    <div className="repayment-table">
      <h3>Your first year, month by month</h3>
      <table>
        <thead>
          <tr>
            <th>Month</th>
            <th>Opening balance</th>
            <th>EMI</th>
            <th>Goes to principal</th>
            <th>Goes to interest</th>
            <th>Closing balance</th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((row) => (
            <tr key={row.month}>
              <td>{row.month}</td>
              <td>{formatRupees(row.openingBalance)}</td>
              <td>{formatRupees(row.emi)}</td>
              <td>{formatRupees(row.principalPaid)}</td>
              <td>{formatRupees(row.interestPaid)}</td>
              <td>{formatRupees(row.closingBalance)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
