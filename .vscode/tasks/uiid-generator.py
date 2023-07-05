import uuid

uuid1 = uuid.uuid1().__str__()
uuid4 = uuid.uuid4().__str__()

print('UUID from a host ID: ', uuid1.replace('-', ''))
print('\n')
print('Random UUID: ', uuid4.replace('-', ''))