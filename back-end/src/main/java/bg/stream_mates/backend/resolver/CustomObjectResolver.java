package bg.stream_mates.backend.resolver;

import com.fasterxml.jackson.annotation.ObjectIdGenerator;
import com.fasterxml.jackson.annotation.ObjectIdResolver;

import java.util.HashMap;
import java.util.Map;

public class CustomObjectResolver implements ObjectIdResolver {
    private final Map<ObjectIdGenerator.IdKey, Object> objects = new HashMap<>();

    @Override
    public void bindItem(ObjectIdGenerator.IdKey id, Object pojo) {
        objects.put(id, pojo);  // Запазва новата инстанция вместо да хвърли грешка .!.!.!
    }

    @Override
    public Object resolveId(ObjectIdGenerator.IdKey id) {
        return objects.get(id);  // Връща последната запазена инстанция ..!.!.!
    }

    @Override
    public ObjectIdResolver newForDeserialization(Object context) {
        return new CustomObjectResolver();
    }

    @Override
    public boolean canUseFor(ObjectIdResolver resolverType) {
        return resolverType.getClass() == getClass();
    }
}
