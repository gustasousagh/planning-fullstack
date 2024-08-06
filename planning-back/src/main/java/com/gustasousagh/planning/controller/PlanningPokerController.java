package com.gustasousagh.planning.controller;

import com.gustasousagh.planning.model.VoteMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class PlanningPokerController {

    private static final Logger logger = LoggerFactory.getLogger(PlanningPokerController.class);

    @MessageMapping("/vote/{sessionId}")
    @SendTo("/topic/votes/{sessionId}")
    public VoteMessage vote(@DestinationVariable String sessionId, VoteMessage voteMessage) throws Exception {
        logger.info("Received vote from {} for session {}: {}", voteMessage.getSender(), sessionId, voteMessage.getVote());
        return voteMessage;
    }

    @MessageMapping("/reveal/{sessionId}")
    @SendTo("/topic/reveal/{sessionId}")
    public String reveal(@DestinationVariable String sessionId ) throws Exception {
        logger.info("Reveal votes for session {}", sessionId);
        return "reveal";
    }
}

