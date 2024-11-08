import { useState, useEffect } from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import searchAnimation from "./assets/lottieFiles/search.json";
import axios from "axios";

function App() {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDomainAge = async () => {
            setLoading(true);
            setError(null);
            setResult(null);

            try {
                const currentTab = await new Promise((resolve, reject) => {
                    chrome.tabs.query(
                        { active: true, currentWindow: true },
                        (tabs) => {
                            if (chrome.runtime.lastError) {
                                reject(chrome.runtime.lastError.message);
                            } else {
                                resolve(tabs[0]);
                            }
                        }
                    );
                });

                const url = new URL(currentTab.url);
                const domain = url.hostname;

                const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/.netlify/functions/api/domain-checker/${domain}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );

                const data = await response.data;

                if (!data || data.error) {
                  throw new Error(data?.error || "Failed to fetch domain age");
              }

                setResult(data.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDomainAge();
    }, []);

    return (
        <div
            className="bg-gray-800 flex flex-col max-w-xs mx-auto overflow-hidden"
            style={{ width: "256px", height: "100%", overflowY: "auto" }}
        >
            <div className="w-64 h-64 mx-auto bg-slate-600">
                <Player
                    autoplay={true}
                    loop={true}
                    src={searchAnimation}
                    style={{ height: "300px", width: "300px" }}
                ></Player>
            </div>

            <div className="px-4 py-6 text-white">
                <h2 className="font-bold text-xl font-mono">
                    Domain Age Checker
                </h2>

                {loading ? (
                    <div className="flex justify-center items-center h-32">
                        <div className="w-12 h-12 rounded-full animate-spin border-2 border-solid border-gray-200 border-t-transparent"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-100 text-red-700 p-4 rounded mt-4 font-mono">
                        <p>Error domain!</p>
                        <small>{error}</small>
                    </div>
                ) : result ? (
                    <dl className="font-mono">
                        <dt className="font-bold mt-2">Domain:</dt>
                        <dd className="font-normal">{result.domain}</dd>

                        <dt className="font-bold mt-2">Registered On:</dt>
                        <dd className="font-normal">
                            {result.registrationYear}
                        </dd>

                        <dt className="font-bold mt-2">Domain Age:</dt>
                        <dd className="font-normal">{result.formattedAge}</dd>

                        <dt className="font-bold mt-2">Registration Date:</dt>
                        <dd className="font-normal">
                            {result.registrationDate}
                        </dd>
                    </dl>
                ) : (
                    <p className="font-normal mt-4">
                        Enter a domain to check its age.
                    </p>
                )}
            </div>
        </div>
    );
}

export default App;
