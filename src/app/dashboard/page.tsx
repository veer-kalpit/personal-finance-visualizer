// import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import ExpenseChart from "@/components/ExpenseChart";

export default function Dashboard() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      {/* <TransactionForm /> */}
      <TransactionList />
      <div className="mt-10" >
         <ExpenseChart />
      </div>
     
    </div>
  );
}
