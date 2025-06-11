#include <iostream>
#include <vector>
#include <string>

using namespace std;

// Function to calculate the time difference in minutes
int calculateTimeDifference(const string& clockTime, const string& grandClockTime) {
    int clockHours = stoi(clockTime.substr(0, 2));
    int clockMinutes = stoi(clockTime.substr(3, 2));
    int grandHours = stoi(grandClockTime.substr(0, 2));
    int grandMinutes = stoi(grandClockTime.substr(3, 2));

    int clockTotalMinutes = clockHours * 60 + clockMinutes;
    int grandTotalMinutes = grandHours * 60 + grandMinutes;

    return clockTotalMinutes - grandTotalMinutes;
}

int main() {
    // Grand Clock Tower time
    string grandClockTime = "15:00";

    // Clock times around town
    vector<string> clockTimes = {"14:45", "15:05", "15:00", "14:40"};

    // Array to store the time differences
    vector<int> timeDifferences;

    // Calculate time differences for each clock
    for (const string& clockTime : clockTimes) {
        timeDifferences.push_back(calculateTimeDifference(clockTime, grandClockTime));
    }

    // Output the time differences
    cout << "Time differences (in minutes): ";
    for (int diff : timeDifferences) {
        cout << diff << " ";
    }
    cout << endl;

    return 0;
}