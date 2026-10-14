package com.example.banking.account;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface AccountRepository extends MongoRepository<AccountDocument, String> {
	List<AccountDocument> findByUserIdOrderByOpenedAtDesc(String userId);
}