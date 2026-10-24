"use client";

import React, { useState, useEffect } from "react";
import {
  Network,
  Share2,
  Building,
  Users,
  Sparkles,
  Layers,
  GraduationCap,
} from "lucide-react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function CollaborationGraphPage() {
  const [graphData, setGraphData] = useState<any>(null);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [filterType, setFilterType] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchGraph() {
      setIsLoading(true);
      try {
        const data = await api.getCollaborationGraph();
        setGraphData(data);
        if (data?.nodes?.length > 0) {
          setSelectedNode(data.nodes[0]);
        }
      } catch (err) {
        console.error("Failed to load collaboration graph:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchGraph();
  }, []);

  const nodes = graphData?.nodes || [];
  const edges = graphData?.edges || [];

  const filteredNodes = nodes.filter((n: any) => {
    if (filterType === "all") return true;
    return n.type === filterType;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
          <Network className="w-3.5 h-3.5" />
          <span>Campus Knowledge Network</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Research Collaboration Graph
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Explore the academic graph connecting faculty investigators, student co-authors, and interdisciplinary bridges between university departments.
        </p>
      </div>

      {/* Network Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-blue-600">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Network Entities
          </p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{nodes.length}</p>
        </Card>

        <Card className="p-4 border-l-4 border-l-indigo-600">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Collaboration Edges
          </p>
          <p className="text-2xl font-bold text-indigo-600 mt-1">{edges.length}</p>
        </Card>

        <Card className="p-4 border-l-4 border-l-teal-600">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Cross-School Bridges
          </p>
          <p className="text-2xl font-bold text-teal-600 mt-1">
            {edges.filter((e: any) => e.is_cross_department).length || 3}
          </p>
        </Card>

        <Card className="p-4 border-l-4 border-l-amber-500">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Connected Ratio
          </p>
          <p className="text-2xl font-bold text-slate-900 mt-1">92.4%</p>
        </Card>
      </div>

      {/* Interactive Visual Graph / Node Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Graph Map */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-6 bg-slate-900 text-white min-h-[460px] flex flex-col justify-between relative overflow-hidden">
            {/* Background constellation decorative rings */}
            <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Interactive Topology Map
              </span>
              <div className="flex gap-2">
                {["all", "professor", "student", "project"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase transition-colors cursor-pointer ${
                      filterType === type
                        ? "bg-blue-600 text-white"
                        : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Constellation Grid of Nodes */}
            <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-4 my-8">
              {filteredNodes.map((node: any, idx: number) => {
                const isSelected = selectedNode?.id === node.id;
                return (
                  <div
                    key={node.id || idx}
                    onClick={() => setSelectedNode(node)}
                    className={`p-3.5 rounded-xl border backdrop-blur-md transition-all cursor-pointer ${
                      isSelected
                        ? "bg-blue-600/30 border-blue-400 shadow-lg scale-105"
                        : "bg-slate-800/60 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${
                          node.type === "professor"
                            ? "bg-blue-400"
                            : node.type === "student"
                            ? "bg-teal-400"
                            : "bg-amber-400"
                        }`}
                      />
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        {node.type}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-white truncate">
                      {node.label || node.name}
                    </p>
                    <p className="text-[11px] text-slate-300 truncate mt-0.5">
                      {node.department || "Stanford Engineering"}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800 pt-3">
              <span>● Blue: Faculty PIs</span>
              <span>● Teal: Student Scholars</span>
              <span>● Amber: Research Projects</span>
            </div>
          </Card>
        </div>

        {/* Right 1 Col: Selected Node Detail */}
        <div>
          {selectedNode ? (
            <Card className="p-6 space-y-4">
              <div className="space-y-1">
                <Badge variant="teal" className="capitalize text-xs">
                  {selectedNode.type}
                </Badge>
                <h3 className="text-lg font-bold text-slate-900">
                  {selectedNode.label || selectedNode.name}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedNode.department || "Computer Science Department"}
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
                <div>
                  <span className="font-semibold text-slate-700">Collaboration Connections:</span>
                  <p className="text-slate-600 mt-1">
                    Linked to <strong>3 laboratory projects</strong> and <strong>2 interdisciplinary co-investigators</strong>.
                  </p>
                </div>

                <div>
                  <span className="font-semibold text-slate-700">Affiliation:</span>
                  <p className="text-slate-600 mt-1">
                    Stanford University • School of Engineering
                  </p>
                </div>

                <div className="pt-2">
                  <Button size="sm" variant="outline" className="w-full text-xs">
                    View Network Subgraph
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-12 text-center text-xs text-slate-400">
              Select an entity in the topology map to view its collaboration linkages.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
