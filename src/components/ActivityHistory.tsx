
import React, { useState } from "react";
import { FitnessActivity } from "@/types/fitness";
import { formatDate } from "@/lib/fitness-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";

interface ActivityHistoryProps {
  activities: FitnessActivity[];
  onEdit: (activity: FitnessActivity) => void;
  onDelete: (id: string) => void;
}

const ActivityHistory: React.FC<ActivityHistoryProps> = ({ activities, onEdit, onDelete }) => {
  const [filters, setFilters] = useState({
    type: "",
    fromDate: "",
    toDate: "",
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  // Apply filters
  const filteredActivities = activities.filter((activity) => {
    let matchesType = true;
    let matchesDateRange = true;

    // Filter by type if selected
    if (filters.type) {
      matchesType = activity.type === filters.type;
    }

    // Filter by date range if selected
    if (filters.fromDate) {
      matchesDateRange = matchesDateRange && activity.date >= filters.fromDate;
    }
    if (filters.toDate) {
      matchesDateRange = matchesDateRange && activity.date <= filters.toDate;
    }

    return matchesType && matchesDateRange;
  });

  // Sort activities by date (newest first)
  const sortedActivities = [...filteredActivities].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Get unique activity types for filter dropdown
  const uniqueTypes = Array.from(new Set(activities.map((a) => a.type)));

  return (
    <div className="space-y-6">
      <div className="bg-card p-4 rounded-lg shadow-sm">
        <h3 className="font-semibold mb-4">Filter Activities</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="type">Activity Type</Label>
            <select
              id="type"
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">All Types</option>
              {uniqueTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="fromDate">From Date</Label>
            <Input
              id="fromDate"
              name="fromDate"
              type="date"
              value={filters.fromDate}
              onChange={handleFilterChange}
            />
          </div>
          <div>
            <Label htmlFor="toDate">To Date</Label>
            <Input
              id="toDate"
              name="toDate"
              type="date"
              value={filters.toDate}
              onChange={handleFilterChange}
              min={filters.fromDate}
            />
          </div>
        </div>
      </div>

      {sortedActivities.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead>Duration (min)</TableHead>
                <TableHead>Calories</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedActivities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell>{formatDate(activity.date)}</TableCell>
                  <TableCell>{activity.type}</TableCell>
                  <TableCell>{activity.duration}</TableCell>
                  <TableCell>{activity.calories}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {activity.notes || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(activity)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(activity.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No activities found matching your filters.
        </div>
      )}
    </div>
  );
};

export default ActivityHistory;
