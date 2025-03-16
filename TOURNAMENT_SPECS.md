# Tournament Application Specifications

## System Overview

This application manages a gaming tournament with two distinct phases:
1. An initial round-robin group phase where all players compete against each other
2. A knockout phase (semi-finals and finals) for the top 4 players from the group phase

## Core Components

### 1. Data Model

#### Player
- `id`: Unique identifier
- `name`: Player name
- `points`: Total points accumulated (1 point per win, 0 points per loss)
- `matches_played`: Number of matches played
- `wins`: Number of wins
- `losses`: Number of losses

#### Match
- `id`: Unique identifier
- `player1_id`: ID of first player
- `player2_id`: ID of second player
- `player1_score`: Score of first player
- `player2_score`: Score of second player
- `winner_id`: ID of winner (determined automatically based on scores)
- `phase`: "group" or "knockout"
- `round`: For knockout phase - "semi-final" or "final"
- `completed`: Boolean flag indicating if match results have been entered

### 2. Views

#### Group Phase View
- Display a comprehensive list showing:
  - All players
  - Points accumulated
  - Matches played, won, and lost
  - Sorting capability by points (descending)

#### Bracket View
- Visual representation of the knockout phase
- Semi-final matches (2 matches)
- Final match (1 match)
- Dynamic updates when match results are entered

#### Input View
- Form for administrators (Jordy and Marciano) to enter match results
- Fields:
  - Player 1 selection
  - Player 2 selection
  - Player 1 score
  - Player 2 score
  - Submit button
- Validation to ensure valid score entries

## Business Logic

### Scoring System
- Winner receives 1 point
- Loser receives 0 points
- No ties allowed (scores must determine a clear winner)

### Tournament Progression
1. Group Phase:
   - All players compete against each other once (round-robin format)
   - Administrators (Jordy and Marciano) enter match results as reported by players
   - System automatically calculates standings

2. Knockout Phase:
   - Top 4 players from group phase qualify
   - Semi-final pairings generated randomly
   - Winners of semi-finals proceed to final
   - Winner of final is tournament champion

### Match Result Processing
- When a score is entered, the system automatically:
  - Determines the winner based on higher score
  - Updates player statistics (points, matches played, wins/losses)
  - Updates tournament progression if applicable

## Technical Requirements

### Data Persistence
- All match results must be stored persistently
- Player standings must be calculated in real-time based on match results

### User Roles
- Anyone can view the tournament standings and bracket
- Anyone can enter match results

### Interface Requirements
- Responsive design for various device sizes
- Clear visual indication of tournament progress
- Intuitive input system for match results

## Implementation Notes for AI Agents

### Context Understanding
- This is a two-phase tournament management system
- The system must track individual matches and aggregate results into standings
- The transition from group phase to knockout phase is based on player rankings
- Random generation is only used for semi-final pairings

### State Management
- Track the current tournament phase
- Maintain complete match history
- Calculate player standings dynamically
- Update bracket visualization based on match results

### UI/UX Flow
1. Initial state: Empty group phase standings
2. As matches are recorded: Group standings update
3. After all group matches: System identifies top 4 players
4. System generates semi-final matchups randomly
5. After semi-finals: System creates final match
6. After final: System displays tournament champion

### Error Handling
- Validate all score inputs
- Prevent duplicate match entries
- Ensure proper progression through tournament phases
- Handle edge cases (e.g., ties in group standings)
