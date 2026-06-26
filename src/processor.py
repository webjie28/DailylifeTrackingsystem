import sys
import json

def process_data(data):
    action = data.get("action")
    if action == "analyze_work_logs":
        logs = data.get("logs", [])
        if not logs:
            return {
                "status": "success",
                "total_minutes": 0,
                "avg_minutes": 0,
                "most_productive_day": "None",
                "project_breakdown": []
            }
        
        total_mins = 0
        durations = []
        project_counts = {}
        day_names = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        day_minutes = {day: 0 for day in day_names}
        
        from datetime import datetime
        
        for log in logs:
            duration = log.get("duration")
            if duration is not None:
                total_mins += duration
                durations.append(duration)
                
            # Parse day of week from date (YYYY-MM-DD)
            date_str = log.get("date")
            try:
                dt = datetime.strptime(date_str, "%Y-%m-%d")
                day_name = day_names[dt.weekday()]
                if duration is not None:
                    day_minutes[day_name] += duration
            except Exception:
                pass
                
            # Project/Task breakdown from note
            note = log.get("note", "").strip()
            if not note:
                note = "General Work"
            project_counts[note] = project_counts.get(note, 0) + (duration or 0)
            
        avg_mins = round(total_mins / len(durations)) if durations else 0
        
        # Find most productive day
        most_productive = "None"
        max_mins = -1
        for day, mins in day_minutes.items():
            if mins > max_mins and mins > 0:
                max_mins = mins
                most_productive = day
                
        proj_breakdown = [{"name": name, "minutes": mins} for name, mins in project_counts.items()]
        
        return {
            "status": "success",
            "total_minutes": total_mins,
            "avg_minutes": avg_mins,
            "most_productive_day": most_productive,
            "project_breakdown": proj_breakdown
        }
        
    result = {"status": "success", "processed": True, "input_received": data}
    return result

if __name__ == "__main__":
    # Basahin ang data mula sa stdin (via python-shell)
    lines = sys.stdin.readlines()
    for line in lines:
        try:
            data = json.loads(line)
            result = process_data(data)
            print(json.dumps(result)) # Ipadala pabalik sa JS
        except Exception as e:
            print(json.dumps({"error": str(e)}))