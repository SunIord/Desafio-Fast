import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { getWorkshops } from "../services/api";
import {
  contarWorkshopsPorColaborador,
  contarPresencasPorWorkshop,
  presencasAoLongoDoTempo,
} from "../utils/chartData";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";

const CORES_PIZZA = ["#2f6f4f", "#5a9c78", "#8fc4a3", "#b7ddc4", "#d8efe1"];

export default function ParticipacaoPage() {
  const [workshops, setWorkshops] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    getWorkshops()
      .then((dados) => setWorkshops(dados))
      .catch((err) => setErro(err.message))
      .finally(() => setCarregando(false));
  }, []);

  if (carregando) return <Loading />;
  if (erro)
    return <EmptyState mensagem={`Não foi possível carregar os dados: ${erro}`} />;
  if (workshops.length === 0)
    return <EmptyState mensagem="Sem workshops registrados para gerar gráficos." />;

  const dadosPorColaborador = contarWorkshopsPorColaborador(workshops);
  const dadosPorWorkshop = contarPresencasPorWorkshop(workshops);
  const dadosNoTempo = presencasAoLongoDoTempo(workshops);

  return (
    <section className="page">
      <h1>Participação</h1>

      <div className="chart-section">
        <h2>Workshops por colaborador</h2>
        <p>Quantidade de workshops em que cada colaborador registrou presença.</p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dadosPorColaborador}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nome" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="total" fill="#2f6f4f" name="Workshops" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-section">
        <h2>Proporção de presenças por workshop</h2>
        <p>Participação de cada workshop no total de presenças registradas no sistema.</p>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={dadosPorWorkshop}
              dataKey="total"
              nameKey="nome"
              outerRadius={100}
              label
            >
              {dadosPorWorkshop.map((_, index) => (
                <Cell key={index} fill={CORES_PIZZA[index % CORES_PIZZA.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-section">
        <h2>Presença ao longo do tempo</h2>
        <p>Evolução do número de presentes por workshop, em ordem cronológica.</p>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dadosNoTempo}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="data" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#2f6f4f"
              strokeWidth={2}
              name="Presentes"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}