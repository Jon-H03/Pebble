import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddTransactionForm } from "./components/AddTransactionForm/AddTransactionForm";
import { Dashboard } from "./components/Dashboard/Dashboard";
import "./App.css";

function App() {
  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-primary">Pebble</h1>
        <p className="text-muted-foreground">Personal Finance Tracker</p>
      </header>

      <Tabs defaultValue="add" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="add">Add Transaction</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <Dashboard />
        </TabsContent>

        <TabsContent value="add">
          <AddTransactionForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default App;