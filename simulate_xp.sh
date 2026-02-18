#!/bin/bash

# Create/Switch to a test branch to avoid cluttering master
BRANCH_NAME="test-xp-activity"
if git show-ref --verify --quiet refs/heads/$BRANCH_NAME; then
    git checkout $BRANCH_NAME
else
    git checkout -b $BRANCH_NAME
fi

FILE="test-file.txt"
touch "$FILE" # Ensure it exists

echo "Starting generic activity simulation on $FILE..."

for i in {1..50}
do
   echo "Generating activity step $i at $(date)" >> "$FILE"
   
   # Simulate a save (implied by writing to disk)
   
   # Commit
   git add "$FILE"
   git commit -m "XP Generation Test: Commit #$i"
   
   echo "Performed commit #$i"
   sleep 2 # Pause to ensure events are distinct
done

echo "Simulation complete. Check your Orb XP!"
