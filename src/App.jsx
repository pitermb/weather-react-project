import { useState, useEffect } from "react";
import "./App.css";
/* uuid para passar uma key para cada Forecast gerado no container */
import { v4 as uuid } from "uuid";
/* Fa Icons para estilizar um pouco a pagina */
import { FaSpinner, FaThermometerHalf, FaWind } from "react-icons/fa";

function App() {
  /* Setando uma cidade padrao */
  const [pesquisaCidade, setPesquisaCidade] = useState("Florianopolis");
  /* Setando a constante responsavel pela response */
  const [weather, setWeather] = useState(null);
  /* Setando a cidade escolhida do usuario */
  const [cidade, setCidade] = useState("");
  /* Setando um loading para animação ao pesquisar */
  const [loading, setLoading] = useState("");

  /* Tradutor manual para algumas frases de tempo em ingles */
  const tradutorDescTempo = {
    "Partly cloudy": "Parcialmente Nublado",
    "Clear": "Tempo Limpo",
    "Light snow": "Neve Leve",
    "Sunny": "Ensolarado",
    "Rain with thunderstorm": "Chuva com Tempestade",
    "Patchy rain possible": "Possibilidade de Chuva Irregular",
  };

  /* Função para capturar a cidade escolhida pelo usuario */
  function handleSubmit(e) {
    e.preventDefault();
    setCidade(pesquisaCidade);
    console.log(pesquisaCidade);
  }

  /* UseEffect aplicado para gerar uma cidade base e conferir a funcionalidade da API */
  useEffect(() => {
    async function pegarTempo() {
      setLoading(true);
      try {
        const response = await fetch(
          `https://goweather.herokuapp.com/weather/${pesquisaCidade}`
        );
        const data = await response.json();
        setWeather(data);
        setCidade(pesquisaCidade);
        console.log(data);
      } catch (error) {
        alert("Erro da API");
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    pegarTempo();
  }, [cidade]);

  /* Componente da pagina */
  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        {/* Poderia ter utilizado o inputRef aqui, fica de info */}
        <input
          type="text"
          placeholder="Ex: Blumenau"
          value={pesquisaCidade}
          onChange={(e) => setPesquisaCidade(e.target.value)}
        />
        {/* Botão com if ternario para realizar uma animação de loading */}
        <button type="submit">
          {loading ? (
            <FaSpinner className="loading" />
          ) : (
            <span>Pesquisar Cidade</span>
          )}
        </button>
      </form>

      {/* Se tiver cidade e tempo, ele retorna o componente renderizado */}
      {cidade && weather && (
        <div>
          <h1>{cidade}</h1>
          <h2>Tempo Atual</h2>
          <p>{weather.temperature}</p>
          <p>
            {/* Verifica Descrição traduzida */}
            {tradutorDescTempo[weather.description]
              ? tradutorDescTempo[weather.description]
              : weather.description}
          </p>

          <h2>Previsão</h2>
          <ol>
            {/* Map para retornar as previsões dos proximos 3 dias */}
            {/* as vezes uma cidade pode ter essa info pela metade por conta da api */}
            {weather.forecast.map((dayForecast, index) => {
              return (
                <li key={uuid()}>
                  <h3>
                    {index == 0
                      ? "Amanhã"
                      : Intl.DateTimeFormat("pt-BR", {
                          weekday: "long",
                        }).format(
                          /* formata o titulo do dia para sequentes de amanhã */
                          new Date().setDate(new Date().getDate() + index)
                        )}
                  </h3>
                  <div>
                    <FaThermometerHalf />
                    <p>{dayForecast.temperature}</p>
                  </div>
                  <div>
                    <FaWind />
                    <p>{dayForecast.wind}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </div>
  );
}

export default App;
